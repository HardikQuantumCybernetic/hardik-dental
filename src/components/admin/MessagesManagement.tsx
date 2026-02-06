import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Mail,
  Search,
  Download,
  Eye,
  User,
  CheckCircle,
  Trash2
} from "lucide-react";
import { downloadCSV, downloadExcel } from "@/utils/downloadUtils";
import { useToast } from "@/hooks/use-toast";
import { useFeedback } from "@/hooks/useSupabaseExtended";
import { supabase } from "@/integrations/supabase/client";

const MessagesManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();
  const { feedback, loading, updateFeedback } = useFeedback();

  // Filter only contact messages
  const contactMessages = useMemo(() => {
    return feedback.filter(item => item.category === 'contact');
  }, [feedback]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": 
        return "bg-dental-blue text-white";
      case "reviewed": 
        return "bg-success text-white";
      default: 
        return "bg-dental-gray text-white";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredMessages = useMemo(() => {
    return contactMessages.filter(message => {
      const matchesSearch = searchTerm === "" || 
        message.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.patient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === "all" || message.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [contactMessages, searchTerm, filterStatus]);

  const handleViewMessage = (messageId: string) => {
    const message = feedback.find(f => f.id === messageId);
    if (message) {
      toast({
        title: `Message from ${message.patient_name}`,
        description: message.message.length > 150 ? message.message.substring(0, 150) + "..." : message.message,
      });
    }
  };

  const handleMarkAsReviewed = async (messageId: string) => {
    try {
      await updateFeedback(messageId, { status: 'reviewed' });
      toast({
        title: "Success",
        description: "Message marked as reviewed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update message status",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (window.confirm("Are you sure you want to delete this message? This action cannot be undone.")) {
      try {
        const { error } = await supabase
          .from('feedback')
          .delete()
          .eq('id', messageId);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Message deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete message",
          variant: "destructive"
        });
      }
    }
  };

  const handleExportMessages = (format: 'csv' | 'excel') => {
    const exportData = filteredMessages.map(message => ({
      'Name': message.patient_name,
      'Email': message.patient_email,
      'Message': message.message,
      'Date': formatDate(message.created_at),
      'Status': message.status
    }));

    if (format === 'csv') {
      downloadCSV(exportData, 'contact-messages-export');
    } else {
      downloadExcel(exportData, 'contact-messages-export');
    }
    
    toast({
      title: "Messages Exported",
      description: `Contact messages have been exported as ${format.toUpperCase()} successfully.`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-dental-blue">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col space-y-2 md:space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Contact Messages</h2>
          <p className="text-dental-gray text-xs sm:text-sm md:text-base">View and manage all contact form submissions in real-time</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="dental-outline" size="sm" onClick={() => handleExportMessages('csv')} className="w-full sm:w-auto text-xs sm:text-sm">
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Export </span>CSV
          </Button>
          <Button variant="dental-outline" size="sm" onClick={() => handleExportMessages('excel')} className="w-full sm:w-auto text-xs sm:text-sm">
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Export </span>Excel
          </Button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <Card className="border-dental-blue-light">
        <CardContent className="p-3 sm:p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            <div>
              <Label htmlFor="search" className="text-dental-blue font-medium mb-1.5 block text-xs sm:text-sm">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-2 sm:left-3 top-2 sm:top-3 w-3 h-3 sm:w-4 sm:h-4 text-dental-gray" />
                <Input
                  id="search"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 sm:pl-10 border-dental-blue-light focus:border-dental-blue text-xs sm:text-sm h-8 sm:h-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="filterStatus" className="text-dental-blue font-medium mb-1.5 block text-xs sm:text-sm">
                Status
              </Label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-1.5 sm:p-2 text-xs sm:text-sm border border-dental-blue-light rounded-md focus:border-dental-blue focus:outline-none bg-background h-8 sm:h-10"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message Statistics */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        <Card className="border-dental-blue-light">
          <CardContent className="p-2 sm:p-3 md:p-4">
            <div className="text-center">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-dental-blue">{contactMessages.length}</p>
              <p className="text-dental-gray text-xs sm:text-sm">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-dental-blue-light">
          <CardContent className="p-2 sm:p-3 md:p-4">
            <div className="text-center">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-warning">{contactMessages.filter(m => m.status === 'new').length}</p>
              <p className="text-dental-gray text-xs sm:text-sm">New</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-dental-blue-light">
          <CardContent className="p-2 sm:p-3 md:p-4">
            <div className="text-center">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-success">{filteredMessages.length}</p>
              <p className="text-dental-gray text-xs sm:text-sm">Filtered</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages Table */}
      <Card className="border-dental-blue-light">
        <CardHeader className="p-3 sm:p-4 md:p-6">
          <CardTitle className="text-dental-blue text-base sm:text-lg md:text-xl">All Contact Messages</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Website contact form submissions with real-time updates</CardDescription>
        </CardHeader>
        <CardContent className="p-2 sm:p-4 md:p-6">
          {filteredMessages.length > 0 ? (
            <div className="rounded-lg border border-dental-blue-light overflow-hidden">
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <Table>
                    <TableHeader className="bg-dental-blue-light hidden sm:table-header-group">
                      <TableRow>
                        <TableHead className="font-semibold text-dental-blue text-xs md:text-sm whitespace-nowrap px-2 sm:px-4">Contact Info</TableHead>
                        <TableHead className="font-semibold text-dental-blue text-xs md:text-sm whitespace-nowrap px-2 sm:px-4 hidden md:table-cell">Message</TableHead>
                        <TableHead className="font-semibold text-dental-blue text-xs md:text-sm whitespace-nowrap px-2 sm:px-4 hidden lg:table-cell">Date</TableHead>
                        <TableHead className="font-semibold text-dental-blue text-xs md:text-sm whitespace-nowrap px-2 sm:px-4">Status</TableHead>
                        <TableHead className="font-semibold text-dental-blue text-xs md:text-sm whitespace-nowrap px-2 sm:px-4">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMessages.map((message) => (
                        <TableRow key={message.id} className="hover:bg-dental-blue-light/50 border-b sm:table-row flex flex-col sm:border-b-0 py-3 sm:py-0">
                          <TableCell className="px-2 sm:px-4 py-2 sm:py-4">
                            <div className="space-y-0.5 sm:space-y-1">
                              <div className="flex items-center space-x-1.5 sm:space-x-2">
                                <User className="w-3 h-3 sm:w-4 sm:h-4 text-dental-blue flex-shrink-0" />
                                <span className="font-medium text-foreground text-xs sm:text-sm break-words">{message.patient_name}</span>
                              </div>
                              <div className="flex items-center space-x-1.5 sm:space-x-2">
                                <Mail className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-dental-gray flex-shrink-0" />
                                <span className="text-xs text-dental-gray break-all">{message.patient_email}</span>
                              </div>
                              <div className="sm:hidden mt-1">
                                <p className="text-xs text-dental-gray line-clamp-2">{message.message}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell px-2 sm:px-4 py-2 sm:py-4">
                            <div className="max-w-xs lg:max-w-md">
                              <p className="text-xs sm:text-sm text-dental-gray line-clamp-2">{message.message}</p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell px-2 sm:px-4 py-2 sm:py-4">
                            <div className="text-xs sm:text-sm text-dental-gray whitespace-nowrap">{formatDate(message.created_at)}</div>
                          </TableCell>
                          <TableCell className="px-2 sm:px-4 py-2 sm:py-4">
                            <Badge className={`${getStatusColor(message.status)} text-[10px] sm:text-xs`}>
                              {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-2 sm:px-4 py-2 sm:py-4">
                            <div className="flex space-x-1 sm:space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-dental-blue hover:bg-dental-blue-light h-7 w-7 sm:h-8 sm:w-8 p-0"
                                onClick={() => handleViewMessage(message.id)}
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              {message.status === 'new' && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-success hover:bg-success/10 h-7 w-7 sm:h-8 sm:w-8 p-0"
                                  onClick={() => handleMarkAsReviewed(message.id)}
                                >
                                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-destructive hover:bg-destructive/10 h-7 w-7 sm:h-8 sm:w-8 p-0"
                                onClick={() => handleDeleteMessage(message.id)}
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <Mail className="w-10 h-10 sm:w-12 sm:h-12 text-dental-gray mx-auto mb-3 sm:mb-4" />
              <p className="text-dental-gray text-xs sm:text-sm">No contact messages found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagesManagement;
